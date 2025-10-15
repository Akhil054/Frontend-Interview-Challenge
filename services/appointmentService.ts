
/**
 * Appointment Service
 *
 * This service provides an abstraction layer for accessing appointment data.
 * It's the single source of truth for all data-related operations.
 *
 * All original TODOs have been completed:
 * 1. Implemented getAppointmentsByDoctor.
 * 2. Implemented getAppointmentsByDoctorAndDate.
 * 3. Implemented getAppointmentsByDoctorAndDateRange (for week view).
 * 4. Added helper methods like getPopulatedAppointment for enriching data.
 * 5. Structured as a class for testability and organized logic.
 */

// Import all necessary types and the raw mock data.
import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PATIENTS } from '@/data/mockData';
// Import date-fns for reliable date comparisons.
import { isSameDay, startOfDay, endOfDay } from 'date-fns';

/**
 * AppointmentService class
 *
 * Provides methods to access and manipulate appointment data.
 * This abstracts data access from the UI components.
 */
export class AppointmentService {
  // Store the raw data as private properties.
  private doctors: Doctor[] = MOCK_DOCTORS;
  private patients: Patient[] = MOCK_PATIENTS;
  private appointments: Appointment[] = MOCK_APPOINTMENTS;

  /**
   * For performance, we create Maps for doctors and patients on initialization.
   * This allows for very fast lookups (O(1) time complexity) compared to
   * searching through an array (O(n)) every time.
   */
  private patientMap: Map<string, Patient>;
  private doctorMap: Map<string, Doctor>;

  constructor() {
    this.patientMap = new Map(this.patients.map(p => [p.id, p]));
    this.doctorMap = new Map(this.doctors.map(d => [d.id, d]));
  }

  /**
   * TODO: Get all doctors
   * Returns the complete list of doctors.
   */
  getAllDoctors(): Doctor[] {
    return this.doctors;
  }

  /**
   * TODO: Get doctor by ID
   * Efficiently finds a single doctor by their ID using the pre-built map.
   */
  getDoctorById(id: string): Doctor | undefined {
    return this.doctorMap.get(id);
  }
  
  /**
   * Helper method to efficiently find a single patient by their ID.
   */
  getPatientById(id: string): Patient | undefined {
    return this.patientMap.get(id);
  }

  /**
   * TODO 1: Implement getAppointmentsByDoctor
   * Get all appointments for a specific doctor, regardless of date.
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    if (!doctorId) return [];
    return this.appointments.filter((apt) => apt.doctorId === doctorId);
  }

  /**
   * TODO 3: Implement getAppointmentsByDoctorAndDateRange (for week view)
   * This is the most flexible method for fetching appointments.
   * It filters appointments by doctor ID and whether their start time falls
   * within the given date range.
   */
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    if (!doctorId) return [];

    return this.appointments.filter(apt => {
      // Ensure the appointment belongs to the correct doctor.
      if (apt.doctorId !== doctorId) return false;
      
      // Check if the appointment's start time is within the range.
      const aptStart = new Date(apt.startTime);
      return aptStart >= startDate && aptStart <= endDate;
    });
  }
  
  /**
   * TODO 2: Implement getAppointmentsByDoctorAndDate
   * This method reuses the date range logic for a single day.
   * It calculates the start and end of the given date and calls the more generic function.
   */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return this.getAppointmentsByDoctorAndDateRange(doctorId, dayStart, dayEnd);
  }

  /**
   * TODO: Implement this helper method
   * "Populates" a single appointment by replacing the `doctorId` and `patientId`
   * with the full Doctor and Patient objects. This is very useful for the UI.
   */
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment {
    const doctor = this.getDoctorById(appointment.doctorId);
    const patient = this.getPatientById(appointment.patientId);

    // In a real application, you'd want more robust error handling.
    if (!doctor || !patient) {
      throw new Error(`Data integrity issue: Doctor or Patient not found for appointment ID ${appointment.id}`);
    }

    return {
      ...appointment,
      doctor,
      patient,
    };
  }

  /**
   * TODO 4: Consider adding helper methods (BONUS)
   * This is a highly useful helper that combines filtering and populating.
   * It gets the appointments for a date range and returns them already populated
   * with full Doctor and Patient details, which is exactly what the UI needs.
   */
  getPopulatedAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): PopulatedAppointment[] {
    const appointments = this.getAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate);
    // Map over the filtered appointments and populate each one.
    return appointments.map(apt => this.getPopulatedAppointment(apt));
  }
}

/**
 * Singleton instance pattern.
 * We export a single, shared instance of the service to be used
 * throughout the application. This is simple and effective for this use case.
 */
export const appointmentService = new AppointmentService();