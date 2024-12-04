
  function updateStatus() {
    const available = document.getElementById('available');
    const notAvailable = document.getElementById('not_available');

    if (available.checked) {
      alert("Product status updated to: Available");
    } else if (notAvailable.checked) {
      alert("Product status updated to: Not Available");
    } else {
      alert("Please select a status.");
    }
  }


function updateTopk() {
    const topkValue = document.getElementById('topk').value;
    // Optionally, update other elements dynamically based on this value
    console.log('Selected Topk:', topkValue); // Just for testing, you can replace it with actual logic.
  }