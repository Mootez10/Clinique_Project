let appointments: any[] = []

export const getAppointments = () => appointments

export const createAppointment = (appt: any) => {
  appointments.push(appt)
}

export const deleteAppointment = (id: string) => {
  appointments = appointments.filter((a) => a.id !== id)
}
