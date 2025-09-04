export const styles = `
@keyframes slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(72px); }
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: 100%; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
`;
