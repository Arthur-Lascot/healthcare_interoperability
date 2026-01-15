import Appointment from "../../DTO/Appointment";
import RendezVous from "../../models/RendezVousMOS";
import Code from "../../utils/structure/MOS/Code";
import identifiant from "../structure/MOS/identifiant";



const AppointmentToRendezVous = (appointment: Appointment): RendezVous => {
    let coding = appointment.appointmentType?.coding![0] || {};
    const typeRdvCode: Code = new Code(coding.code || 'truc', coding.display, coding.system, coding.version);
    const prioriteCode = new Code(appointment.priority?.toString() || '0');
    const statusRdvCode: Code = new Code(appointment.status);

    let idRdv = undefined;
    if (appointment.identifier) {
        const idRdv: identifiant = {
            valeur:             appointment.identifier.value!,
            qualification:      appointment.identifier.use,
            identifiantSysteme: appointment.identifier.system,
            nomSysteme:         appointment.identifier.system,
            versionSysteme:     undefined,
            URISysteme:         undefined,
            identifiantAgence:  undefined,
            nomAgence:          undefined,
            typeIdentifiant:    undefined
        }
    }

    const rendezVous =  new RendezVous({
        idRdv: idRdv,
        typeRdv: typeRdvCode,
        datePriseRdv: appointment.created,
        dateDebutRdv: appointment.start,
        dateFinRdv: appointment.end,
        dateAnnulationRdv: undefined,
        pieceJointe: undefined,
        priorite: prioriteCode,
        titreRdv: undefined,
        statusRdv: statusRdvCode,
        descriptionRdv: appointment.description,
        motifRdv: undefined,
        commentaire: appointment.comment,
        metadonnee: undefined
    });

    return rendezVous
}

export default AppointmentToRendezVous;