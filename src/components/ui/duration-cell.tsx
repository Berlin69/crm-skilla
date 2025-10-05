import {useEffect, useMemo, useRef, useState} from "react"
import {Play, Pause, Loader, X} from "lucide-react"
import {formatDuration} from "@/shared/lib/format-duration"
import type {Call} from "@/entities/call/model/types"
import {useCallRecord} from "@/entities/call/hooks/use-call-record.tsx";
import {IconDownload} from "@/components/icons/icon-download.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import * as React from "react";

type Props = { call: Call }

export function DurationCell({call}: Props) {
  const [open, setOpen] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)

  const trackRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const [showTip, setShowTip] = useState(false)
  const [hoverP, setHoverP] = useState(0)

  const durationSec =
    (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0)
      ? Math.floor(audioRef.current.duration)
      : call.duration

  const {blob, isFetching, refetch} = useCallRecord({
    recordId: call.recordId ?? undefined,
    partnershipId: call.partnershipId,
  })

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    setBlobUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const filename = useMemo(() => `call-${call.id}.mp3`, [call.id])

  const toggleOpen = async () => {
    if (!open) {
      if (!call.recordId) return
      if (!blob && !isFetching) await refetch()
    }
    setOpen(v => !v)
  }

  const onTogglePlay = async () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      await a.play().catch(() => {
      })
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  const onTimeUpdate = () => {
    const a = audioRef.current
    if (!a || !isFinite(a.duration) || a.duration <= 0) return
    setProgress(a.currentTime / a.duration)
  }

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!blobUrl || isFetching) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    updateHoverFromClientX(e.clientX)
    updateFromClientX(e.clientX)
    setShowTip(true)
  }

  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!blobUrl || isFetching) return
    if (dragging) {
      updateHoverFromClientX(e.clientX)
      updateFromClientX(e.clientX)
    } else {
      updateHoverFromClientX(e.clientX)
    }
  }

  const onTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      console.error(e)
    }
  }

  const onTrackPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!blobUrl || isFetching) return
    setShowTip(true)
    updateHoverFromClientX(e.clientX)
  }

  const onTrackPointerLeave = () => {
    setDragging(false)
    setShowTip(false)
  }

  // Управление и перемотка
  const onTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a || !isFinite(a.duration) || a.duration <= 0) return
    const step = 5
    if (e.key === "ArrowRight") {
      a.currentTime = Math.min(a.duration, a.currentTime + step)
      setProgress(a.currentTime / a.duration)
      e.preventDefault()
    } else if (e.key === "ArrowLeft") {
      a.currentTime = Math.max(0, a.currentTime - step)
      setProgress(a.currentTime / a.duration)
      e.preventDefault()
    } else if (e.key === "Home") {
      a.currentTime = 0
      setProgress(0)
      e.preventDefault()
    } else if (e.key === "End") {
      a.currentTime = a.duration
      setProgress(1)
      e.preventDefault()
    }
  }

  const pctFromClientX = (clientX: number) => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }

  const updateFromClientX = (clientX: number) => {
    const a = audioRef.current
    if (!a || !isFinite(a.duration) || a.duration <= 0) return
    const p = pctFromClientX(clientX)
    a.currentTime = p * a.duration
    setProgress(p)
  }

  const updateHoverFromClientX = (clientX: number) => {
    setHoverP(pctFromClientX(clientX))
  }


  if (!open) {
    return (
      <button
        type="button"
        className="w-full text-right hover:underline disabled:cursor-not-allowed"
        onClick={toggleOpen}
        disabled={!call.recordId}
        title={call.recordId ? "Прослушать" : "Запись недоступна"}
      >
        {formatDuration(call.duration)}
      </button>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3 rounded-full bg-[#eef3fb] px-[18px] py-1.5 w-fit">
          <span className="text-sm text-[#1A1A1A] min-w-[40px]">
            {formatDuration(call.duration)}
          </span>

          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shrink-0 cursor-pointer"
            disabled={!blobUrl || isFetching}
            title={playing ? "Пауза" : "Воспроизвести"}
          >
            {isFetching ? (
              <Loader className="animate-spin"/>
            ) : playing ? (
              <Pause fill="#002CFB" className="size-3 border-none text-plt-accent"/>
            ) : (
              <Play fill="#002CFB" className={cn("size-3 border-none text-plt-accent")}/>
            )}
          </button>

          <div
            ref={trackRef}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onKeyDown={onTrackKeyDown}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={onTrackPointerUp}
            onPointerEnter={onTrackPointerEnter}
            onPointerLeave={onTrackPointerLeave}
            className={cn(
              "relative h-1.5 w-[220px] cursor-pointer rounded-full",
              "bg-[#dfe7ff] transition-opacity",
              (!blobUrl || isFetching) && "opacity-50 pointer-events-none",
            )}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#5972ff]"
              style={{width: `${progress * 100}%`}}
            />

            {showTip && (
              <div
                className="pointer-events-none absolute -top-5 translate-x-[-50%]
                 rounded-md px-1.5 py-0.5 text-sm leading-4"
                style={{left: `${hoverP * 100}%`}}
              >
                {formatDuration(Math.round(hoverP * durationSec))}
              </div>
            )}
          </div>

          {blobUrl ? (
            <a
              href={blobUrl}
              download={filename}
              className="text-[#3D6AE6] hover:underline [&>svg>path]:hover:fill-plt-accent"
              title="Скачать"
            >
              <IconDownload/>
            </a>
          ) : (
            <Button
              variant="ghost"
              className="!p-0 hover:cursor-pointer text-plt-accent-transparent hover:text-plt-accent"
              onClick={() => refetch()}
              title="Загрузить запись"
              disabled={isFetching}
            >
              <IconDownload/>
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="!p-0 hover:cursor-pointer text-plt-accent-transparent hover:text-plt-accent"
          >
            <X size={18}/>
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={blobUrl ?? undefined}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  )
}