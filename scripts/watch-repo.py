#!/usr/bin/env python3
"""
msxxyfero-shopify 仓库监听脚本 — 跑在用户电脑上，不是跑在 Muse 云端。

作用：每隔几分钟 git pull 一次仓库，发现 Muse 推了新任务（tasks/ 或 briefs/
里有新文件/改动），就调一次 `codex exec` 让 Codex 去做，做完 Codex 自己 git push。

为什么需要这个脚本：
  Muse 在云端够不到用户电脑，没法直接叫醒 Codex。
  所以触发分两段：Muse 只负责把任务写进 GitHub 仓库；
  这个脚本跑在用户电脑上，负责发现新任务、叫 Codex 干活。
  延迟 = 轮询间隔，默认 5 分钟，不是实时推送。

怎么装（让用户电脑上的 Codex 来装，Muse 装不了）：
  1. Codex 先 git clone https://github.com/Summer991203/msxxyfero-shopify.git
  2. 在仓库目录里跑：python scripts/watch-repo.py
     想开机自动跑，让 Codex 按电脑系统设一个定时任务：
     Windows 用任务计划程序，Mac 用 launchd，Linux 用 cron，
     都是“每 5 分钟跑一次这个脚本”或“开机启动这个脚本”。
  3. 额度用完时 codex exec 会失败，脚本会等 1 小时再试，不会一直刷额度。

状态文件：~/.msxxyfero-watcher-state.json（不进仓库）
日志：~/.msxxyfero-watcher.log
"""

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent.parent
POLL_SECONDS = 300          # 轮询间隔，5 分钟
RETRY_AFTER_FAILURE = 3600  # codex 失败（比如额度用完）后，等 1 小时再试
STATE_FILE = Path(os.environ.get("MSXXYFERO_STATE_FILE", Path.home() / ".msxxyfero-watcher-state.json"))
LOG_FILE = Path(os.environ.get("MSXXYFERO_LOG_FILE", Path.home() / ".msxxyfero-watcher.log"))
WATCHED_DIRS = ("tasks/", "briefs/")


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    try:
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def run(cmd: list[str], timeout: int = 120) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, cwd=REPO_DIR, capture_output=True, text=True, encoding="utf-8",
        errors="replace", timeout=timeout, check=True
    )


def load_state() -> dict:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state), encoding="utf-8")


def main() -> None:
    log(f"watcher started, repo={REPO_DIR}, poll={POLL_SECONDS}s")
    state = load_state()
    while True:
        try:
            run(["git", "pull", "--ff-only", "origin", "main"], timeout=120)
            head = run(["git", "rev-parse", "origin/main"], timeout=60)
            new_sha = head.stdout.strip()
            if not new_sha:
                log("could not read origin/main, retry later")
                time.sleep(POLL_SECONDS)
                continue

            last_sha = state.get("last_sha")
            if last_sha is None:
                # 第一次跑：只记下当前版本，不把旧任务再做一遍。
                state["last_sha"] = new_sha
                save_state(state)
                log(f"first run, baseline set to {new_sha[:7]}")
                time.sleep(POLL_SECONDS)
                continue

            if new_sha == last_sha:
                time.sleep(POLL_SECONDS)
                continue

            # 有新提交：只看 tasks/ 和 briefs/ 有没有变，没变就不叫 Codex，省额度。
            diff = run(
                ["git", "diff", "--name-only", last_sha, new_sha], timeout=60
            )
            changed = [p for p in diff.stdout.splitlines() if p.startswith(WATCHED_DIRS)]
            if not changed:
                state["last_sha"] = new_sha
                save_state(state)
                log(f"new commit {new_sha[:7]} but no tasks/briefs change, skip")
                time.sleep(POLL_SECONDS)
                continue

            next_retry = state.get("next_retry", 0)
            if time.time() < next_retry:
                log("in cooldown after a failed run, waiting")
                time.sleep(POLL_SECONDS)
                continue

            log(f"new tasks found in {changed}, running codex exec")
            run(
                [
                    os.environ.get("MSXXYFERO_CODEX_EXE") or shutil.which("codex") or "codex",
                    "exec", "--skip-git-repo-check", "--sandbox", "workspace-write",
                    "--add-dir", "D:/Codex",
                    "-c", "sandbox_workspace_write.network_access=true",
                    "-C", str(REPO_DIR),
                    "Read status.md, CODEX.md, and the new or changed files in "
                    "tasks/ and briefs/. Do the pending items in order, follow "
                    "CODEX.md. "
                    "Save all deliverables in D:/Codex. Update status.md before git push. "
                    "If a required tool, approval, image generation or publishing step is "
                    "unavailable, record the blocker truthfully and exit nonzero; never "
                    "report an unpublished article as live.",
                ],
                timeout=3600,
            )
            state["last_sha"] = new_sha
            state.pop("next_retry", None)
            save_state(state)
            log(f"codex finished OK for {new_sha[:7]}")
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError) as exc:
            if "exec" in exc.cmd:
                state["next_retry"] = time.time() + RETRY_AFTER_FAILURE
                save_state(state)
                log(f"codex failed or timed out; cooling down {RETRY_AFTER_FAILURE}s: {str(exc)[-500:]}; stderr tail: {str(getattr(exc, 'stderr', '') or '')[-500:]}")
            else:
                log(f"git command failed; no Codex launched: {str(exc)[-500:]}")
        except Exception as exc:  # noqa: BLE001 - watcher must not die on one error
            log(f"unexpected error: {exc!r}")
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("watcher stopped", flush=True)
        sys.exit(0)
