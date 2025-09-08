export const CakeCookiesLoader: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center w-28">
      <div className="relative flex items-center justify-between w-full mb-2">
        <span className="absolute left-0 text-2xl animate-[slide_3s_linear_forwards]">
          🍰
        </span>
        <span className="absolute right-0 text-2xl">🚚</span>
      </div>
      <div className="w-full h-2 bg-rose-200 rounded-full overflow-hidden">
        <div className="h-full bg-rose-500 animate-[progressFill_3s_linear_forwards]"></div>
      </div>
    </div>
  );
};


