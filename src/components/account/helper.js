export const formatDate = date => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dt = new Date(date).toLocaleDateString(navigator.language, options);
  return dt;
};
