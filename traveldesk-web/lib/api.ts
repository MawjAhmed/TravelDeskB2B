
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5075";

// =========================
// Flight Types
// =========================

export interface Flight {
  id: number;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  availableSeats: number;
}

export interface FlightSearchParams {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
}

// =========================
// Booking Types
// =========================

export interface CreateBookingRequest {
  flightId: number;
  passengerName: string;
  passengerEmail: string;
  numberOfPassengers: number;
}

export interface BookingResponse {
  message: string;
  id: number;
  bookingReference: string;
  flightId: number;
  passengerName: string;
  passengerEmail: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  availableSeats: number;
}

export interface Booking {
  id: number;
  bookingReference: string;
  flightId: number;
  passengerName: string;
  passengerEmail: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  flight?: Flight;
}

// =========================
// API Response Handler
// =========================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status}`;

    try {
      const errorData: unknown = await response.json();

      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof errorData.message === "string"
      ) {
        errorMessage = errorData.message;
      } else if (
        typeof errorData === "object" &&
        errorData !== null &&
        "title" in errorData &&
        typeof errorData.title === "string"
      ) {
        errorMessage = errorData.title;
      }
    } catch {
      // Keep the default error message if the response is not JSON.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// =========================
// Get All Flights
// GET /api/flights
// =========================

export async function getFlights(): Promise<Flight[]> {
  const response = await fetch(`${API_BASE_URL}/api/flights`, {
    cache: "no-store",
  });

  return handleResponse<Flight[]>(response);
}

// =========================
// Search Flights
// GET /api/flights/search
// =========================

export async function searchFlights(
  params: FlightSearchParams
): Promise<Flight[]> {
  const query = new URLSearchParams({
    departureCity: params.departureCity.trim(),
    arrivalCity: params.arrivalCity.trim(),
    departureDate: params.departureDate,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/flights/search?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  return handleResponse<Flight[]>(response);
}

// =========================
// Create Booking
// POST /api/bookings
// =========================

export async function createBooking(
  request: CreateBookingRequest
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    cache: "no-store",
  });

  return handleResponse<BookingResponse>(response);
}

// =========================
// Get All Bookings
// GET /api/bookings
// =========================

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    cache: "no-store",
  });

  return handleResponse<Booking[]>(response);
}

// =========================
// Get Booking By ID
// GET /api/bookings/{id}
// =========================

export async function getBookingById(id: number): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    cache: "no-store",
  });

  return handleResponse<Booking>(response);
}

// =========================
// Cancel Booking
// PUT /api/bookings/{id}/cancel
// =========================

export async function cancelBooking(id: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/${id}/cancel`,
    {
      method: "PUT",
      cache: "no-store",
    }
  );

  await handleResponse<unknown>(response);
}
