async function cancelSchedule(scheduleId) {
  let response = await fetch(`/api/schedules/${scheduleId}`, { method: 'DELETE' });
  if (response.ok) {
    alert("Success");
  } else {
    let text = await response.text();
    alert(text);
  }
}

async function cancelBooking(bookingId) {
  let response = await fetch(`/api/bookings/${bookingId}`, { method: 'PUT' });
  if (response.ok) {
    alert("Success");
  } else {
    let text = await response.text();
    alert(text);
  }
}