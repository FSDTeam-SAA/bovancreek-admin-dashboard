export interface Booking {
  _id: string
  parentId: {
    _id: string
    name: string
    username: string
  }
  childId: {
    _id: string
    fullName: string
    schoolName: string
  }
  routeId: any
  pickupLocation: string
  dropOffLocation: string
  dropOffTime: string
  totalPayment: number
  credit: number
  isApprove: boolean
  status: "pending" | "inProgress" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  _id: string
  regNum: string
  type: string
  capacity: number
  fitNessCertificate: {
    public_id: string
    url: string
  }
  insurance: {
    public_id: string
    url: string
  }
  motDate: string
  insuranceExpire: string
  driverId: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface Driver {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    role: string
  }
  assignedVehicle: Vehicle
  AssignedRoute: any
  license: {
    public_id: string
    url: string
  }
  certificate: {
    public_id: string
    url: string
  }
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Route {
  _id: string
  routeName: string
  routeType: "pickup" | "dropoff"
  routeFare: number
  routeTime: string
  driverId: string
  startLocation: {
    name: string
    location: {
      type: string
      coordinates: number[]
    }
  }
  endLocation: {
    name: string
    location: {
      type: string
      coordinates: number[]
    }
  }
  stops: Array<{
    name: string
    arrivalTime: string
    order: number
    location: {
      type: string
      coordinates: number[]
    }
  }>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Parent {
  _id: string
  name: string
  email: string
  username: string
  avatar: {
    url: string
    public_id: string
  }
  emergencyContact: number
  location: string
  credit: number | null
  fine: number
  role: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  _id: string
  orderId: string
  userId: string | null
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  captureId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  email: string
  role: "admin" | "parent" | "driver"
  accessToken: string
  refreshToken: string
}
