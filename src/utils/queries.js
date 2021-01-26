

// This file exists to add a level of abstraction to network calls. That way
// If we want to change the firestore structure, or even change to a different backend
// we only have to modify these functions


// Queries for functionality we have
// 1) getBookings(user, start, end)
// 2) getServices(user)
// 3) editService(service, values)
// 4) editBooking(booking, values)
// 5) editUser(user, values)
// 6) createInvoice(booking)
// 7) declineBooking(booking)
// 8) acceptBooking(booking)
// 9) editAvailability(user, values)

// Queries for additional functionality
// 1) getCustomers(user)
// 2) createBooking(user, values)    <-- lets user manually create a booking
// 3) getCustomer(user) <-- gets a detailed view of a single customer. list of appointments, etc.
// 4) getInvoices(user) <-- gets all invoices for a user (unfiltered)

