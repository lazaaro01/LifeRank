"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CircleDot, X } from "lucide-react";

type CameraCaptureProps = {
  onCapture: (file: File) => void;
};

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsOpen(false);
  };

  useEffect(() => stopCamera, []);

  const openCamera = async () => {
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Este navegador não permite acesso à câmera. Tente atualizar o navegador."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setIsOpen(true);
    } catch {
      setCameraError(
        "Não foi possível acessar a câmera. Verifique se você deu permissão pro navegador."
      );
    }
  };

  useEffect(() => {
    if (isOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isOpen]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(
            new File([blob], `atividade-${Date.now()}.jpg`, {
              type: "image/jpeg",
            })
          );
        }
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  if (isOpen) {
    return (
      <div className="relative overflow-hidden rounded-xl border bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-56 w-full object-cover"
        />
        <button
          type="button"
          onClick={stopCamera}
          aria-label="Cancelar"
          className="bg-foreground/70 text-background absolute top-3 right-3 flex size-8 items-center justify-center rounded-full"
        >
          <X className="size-4" />
        </button>
        <button
          type="button"
          onClick={capture}
          aria-label="Capturar foto"
          className="absolute bottom-3 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <CircleDot className="text-primary size-9" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={openCamera}
        className="border-border text-muted-foreground hover:border-primary hover:text-primary flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed"
      >
        <Camera className="size-6" />
        <span className="text-sm font-medium uppercase">Abrir câmera</span>
      </button>
      {cameraError && (
        <p className="text-destructive text-sm">{cameraError}</p>
      )}
    </div>
  );
}
