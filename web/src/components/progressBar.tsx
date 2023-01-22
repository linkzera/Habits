interface ProgressBarProps {
  progress: number;
}

export function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="w-full bg-zinc-700  rounded-2xl mt-2 mb-4 h-3">
      <div
        className="h-3 rounded-xl bg-violet-600 transition-all"
        role="progressbar"
        aria-label="progressos de hábitos completados nesse dia"
        aria-valuenow={props.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${props.progress}%` }}
      ></div>
    </div>
  );
}
