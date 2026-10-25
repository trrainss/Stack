"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

export function HeroVisual() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.6 });

  const mainX = useTransform(smoothX, [-0.5, 0.5], [8, -8]);
  const mainY = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const phoneX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const phoneY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const cardX = useTransform(smoothX, [-0.5, 0.5], [5, -5]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType === "touch") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mt-14 select-none border-y border-line bg-surface px-4 py-8 sm:px-8 sm:py-12 lg:mt-20 lg:px-12 lg:py-16"
      aria-label="Композиция из макетов интерфейсов: десктопная версия концепта Aster и мобильный экран"
      role="img"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <p className="mono-label">Концепт / Aster</p>
          <p className="mono-label hidden sm:block">Desktop 1440 · Mobile 390</p>
        </div>

        <div className="relative mx-auto max-w-[1080px]">
          <motion.div
            style={reduce ? undefined : { x: mainX, y: mainY }}
            className="relative z-10 w-full border border-[#333] bg-[#0c0c0c] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-[#262626] px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-[#3a3a3a]" />
                <span className="h-2 w-2 rounded-full bg-[#3a3a3a]" />
                <span className="h-2 w-2 rounded-full bg-[#3a3a3a]" />
              </span>
              <span className="ml-2 flex-1 truncate border border-[#242424] bg-[#111] px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#8a8a8a]">
                stacklab.studio / concepts / aster
              </span>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-[#242424] p-5 sm:p-7 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fg">
                    Aster
                  </span>
                  <span className="hidden gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#7c7c7c] sm:flex">
                    <span>Продукт</span>
                    <span>Возможности</span>
                    <span>Контакты</span>
                  </span>
                </div>

                <p className="mt-8 max-w-[26ch] text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
                  Финансовая отчётность без таблиц
                </p>
                <p className="mt-3 max-w-[36ch] text-[11px] leading-relaxed text-[#8f8f8f]">
                  Собираем показатели из ваших систем и показываем картину бизнеса в одном окне.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="inline-flex h-8 items-center bg-fg px-3 text-[10px] font-medium text-base">
                    Запросить демо
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                    Без установки
                  </span>
                </div>

                <div className="mt-7 border border-[#262626] bg-[#101010] p-3">
                  <div className="flex items-end justify-between gap-3">
                    <div className="grid flex-1 gap-1.5">
                      {[92, 74, 58, 84, 66].map((width, index) => (
                        <span
                          key={index}
                          className="block h-1.5 bg-[#2b2b2b]"
                          style={{ width: `${width}%` }}
                        />
                      ))}
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f6f6f]">
                      Q3 / 2026
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <img
                  src="/projects/aster-cover.svg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 border border-white/10 bg-black/40 p-3 backdrop-blur-sm">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b0b0b0]">
                    Отчёт / июль
                  </p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-fg">Демо-данные</span>
                    <span className="font-mono text-[9px] text-[#9a9a9a]">Пример UI</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { x: phoneX, y: phoneY }}
            className="absolute -bottom-10 right-0 z-20 w-[124px] border border-[#3a3a3a] bg-[#0c0c0c] p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)] sm:-bottom-14 sm:right-4 sm:w-[164px] lg:w-[188px]"
          >
            <div className="border border-[#242424] bg-[#0a0a0a]">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                  Aster
                </span>
                <span className="h-1 w-4 bg-[#3a3a3a]" aria-hidden="true" />
              </div>
              <div className="px-3 pb-3">
                <p className="text-[13px] font-medium leading-tight tracking-tight text-fg sm:text-[15px]">
                  Отчётность в одном экране
                </p>
                <img
                  src="/projects/aster-cover.svg"
                  alt=""
                  className="mt-2.5 h-[64px] w-full object-cover sm:h-[84px]"
                  loading="lazy"
                />
                <div className="mt-2.5 grid gap-1.5">
                  <span className="block h-1 w-full bg-[#262626]" />
                  <span className="block h-1 w-3/4 bg-[#262626]" />
                </div>
                <span className="mt-3 flex h-6 items-center justify-center bg-fg text-[8px] font-medium text-base">
                  Попробовать
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { x: cardX }}
            className="absolute -left-2 -top-6 z-20 hidden border border-[#333] bg-[#0e0e0e] p-3 sm:block lg:-left-8 lg:p-4"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#7f7f7f]">
              Типографика
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-medium leading-none tracking-tight text-fg">Aa</span>
              <span className="pb-1 font-mono text-[8px] leading-tight text-[#8a8a8a]">
                Space Grotesk
                <br />
                500 / 96
              </span>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 sm:mt-20">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7a7a7a]">
            <ArrowUpRight size={12} aria-hidden="true" />
            <span>Структура / дизайн / разработка</span>
          </div>
          <div className="h-10 w-px bg-line" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
