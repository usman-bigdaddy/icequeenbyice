export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get day, month (short), and year in "dd-MMM-yyyy" format
  const day = date.getDate().toString().padStart(2, "0"); // Ensure 2 digits
  const month = date.toLocaleString("en-US", { month: "short" }); // Get abbreviated month
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
