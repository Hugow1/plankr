// Time formating based on input.
export const formatTime = (time) => {
  const getMiliSeconds = `0${(time / 10) % 100}`.slice(-2);
  const getSeconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
  const getMinutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);

  return `${getMinutes} : ${getSeconds} : ${getMiliSeconds}`;
};
