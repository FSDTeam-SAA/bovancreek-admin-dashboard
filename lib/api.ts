import apiClient from "./api-client"

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => apiClient.post("/users/login", { email, password }),
  forgetPassword: (email: string) => apiClient.post("/auth/forget-password", { email }),
  verifyCode: (email: string, otp: string) => apiClient.post("/auth/verify-code", { email, otp }),
  resetPassword: (email: string, newPassword: string) => apiClient.post("/auth/reset-password", { email, newPassword }),
}

// Bookings APIs
export const bookingsAPI = {
  getAllBookings: (page = 1, limit = 10) => apiClient.get(`/schedule-booking/all-booking?page=${page}&limit=${limit}`),
  getBookingDetails: (bookingId: string) => apiClient.get(`/schedule-booking/${bookingId}`),
}

// Vehicles APIs
export const vehiclesAPI = {
  getAllVehicles: (page = 1, limit = 10) => apiClient.get(`/vehicles?page=${page}&limit=${limit}`),
  getVehicleDetails: (vehicleId: string) => apiClient.get(`/vehicles/${vehicleId}`),
  createVehicle: (data: any) => apiClient.post("/vehicles", data),
  updateVehicle: (vehicleId: string, data: any) => apiClient.put(`/vehicles/${vehicleId}`, data),
  deleteVehicle: (vehicleId: string) => apiClient.delete(`/vehicles/${vehicleId}`),
}

// Drivers APIs
export const driversAPI = {
  getAllDrivers: (page = 1, limit = 10) => apiClient.get(`/users/all/drivers-with-details?page=${page}&limit=${limit}`),
  getDriverDetails: (driverId: string) => apiClient.get(`/driver-details/${driverId}`),
}

// Routes APIs
export const routesAPI = {
  getAllRoutes: () => apiClient.get("/routes/get-all"),
  getRouteDetails: (routeId: string) => apiClient.get(`/routes/get/${routeId}`),
  createRoute: (data: any) => apiClient.post("/routes/add", data),
  updateRoute: (routeId: string, data: any) => apiClient.put(`/routes/${routeId}`, data),
  deleteRoute: (routeId: string) => apiClient.delete(`/routes/${routeId}`),
}

// Parents APIs
export const parentsAPI = {
  getAllParents: (page = 1, limit = 10) => apiClient.get(`/users/parents?page=${page}&limit=${limit}`),
  getParentDetails: (parentId: string) => apiClient.get(`/users/parents/${parentId}`),
}

// Payments APIs
export const paymentsAPI = {
  getAllPayments: (page = 1, limit = 10, status = "completed") =>
    apiClient.get(`/paypal/all?page=${page}&limit=${limit}&status=${status}`),
}

// User APIs
export const userAPI = {
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post("/user/change-password", { oldPassword, newPassword }),
}
