"use client"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyIcon, CheckIcon, PlayIcon, XIcon } from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      Loading editor…
    </div>
  ),
})

const LANGUAGES = [
  "javascript", "typescript", "python", "go", "rust", "java",
  "cpp", "csharp", "html", "css", "json", "sql", "bash",
]

const RUNNABLE = new Set(["javascript", "typescript"])

interface OutputLine {
  id: string
  text: string
  kind: "log" | "error" | "warn"
}

interface Props {
  channel: any | null
}

export function CodeEditor({ channel }: Props) {
  const { theme } = useTheme()
  const [code, setCode] = useState("// Start coding collaboratively!\n")
  const [language, setLanguage] = useState("javascript")
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [showOutput, setShowOutput] = useState(false)
  const suppressBroadcast = useRef(false)

  useEffect(() => {
    if (!channel) return
    const handler = (event: any) => {
      if (event.type === "code_update") {
        suppressBroadcast.current = true
        setCode(event.code ?? "")
        setLanguage(event.language ?? "javascript")
        suppressBroadcast.current = false
      }
    }
    channel.on("code_update", handler)
    return () => channel.off("code_update", handler)
  }, [channel])

  function handleCodeChange(value: string | undefined) {
    const newCode = value ?? ""
    setCode(newCode)
    if (!suppressBroadcast.current && channel) {
      channel.sendEvent({ type: "code_update", code: newCode, language })
    }
  }

  function handleLanguageChange(lang: string) {
    setLanguage(lang)
    if (channel) {
      channel.sendEvent({ type: "code_update", code, language: lang })
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRun() {
    const lines: OutputLine[] = []

    const capture =
      (kind: OutputLine["kind"]) =>
      (...args: unknown[]) =>
        lines.push({
          id: crypto.randomUUID(),
          text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
          kind,
        })

    const origLog = console.log
    const origError = console.error
    const origWarn = console.warn
    console.log = capture("log")
    console.error = capture("error")
    console.warn = capture("warn")

    try {
      // Strip TypeScript-only syntax so the browser can evaluate it
      const stripped = code
        .replace(/:\s*\w+(\[\])?(\s*[|&]\s*\w+(\[\])?)*(?=[,)=;\n])/g, "")
        .replace(/<[A-Z][^>]*>/g, "")
      // eslint-disable-next-line no-new-func
      new Function(stripped)()
    } catch (err: any) {
      lines.push({ id: crypto.randomUUID(), text: err.message, kind: "error" })
    } finally {
      console.log = origLog
      console.error = origError
      console.warn = origWarn
    }

    setOutput(lines)
    setShowOutput(true)
  }

  const canRun = RUNNABLE.has(language)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-xs bg-background border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          {canRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              className="h-7 px-2 text-xs gap-1 text-green-500 hover:text-green-600 hover:bg-green-500/10"
              title="Run (JS/TS only)"
            >
              <PlayIcon size={13} />
              Run
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            {copied ? (
              <CheckIcon size={14} className="text-green-500" />
            ) : (
              <CopyIcon size={14} />
            )}
          </Button>
        </div>
      </div>

      <div className={`flex-1 min-h-0 ${showOutput ? "h-[60%]" : "h-full"}`}>
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 8 },
          }}
        />
      </div>

      {showOutput && (
        <div className="border-t flex flex-col" style={{ height: "40%" }}>
          <div className="flex items-center justify-between px-3 py-1 border-b bg-muted/40">
            <span className="text-xs font-medium text-muted-foreground">Output</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={() => setShowOutput(false)}
            >
              <XIcon size={12} />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 py-2 font-mono text-xs">
            {output.length === 0 ? (
              <p className="text-muted-foreground">No output</p>
            ) : (
              output.map((line) => (
                <div
                  key={line.id}
                  className={
                    line.kind === "error"
                      ? "text-red-500"
                      : line.kind === "warn"
                      ? "text-yellow-500"
                      : "text-foreground"
                  }
                >
                  {line.text}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
