export const SuccessAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-2 animate-fadeIn">
      <span className="text-3xl animate-bounce">🎉</span>
      <span className="text-lg font-semibold text-rose-600">
        Order Ready!
      </span>
      <div className="flex gap-2 text-2xl">
        <span>🍰</span>
        <span>🍪</span>
        <span>🎂</span>
      </div>
    </div>
  );
};
