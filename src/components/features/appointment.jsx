import { InlineWidget } from "react-calendly"

// Appointment component to embed Calendly scheduler
const Appointment = () => {
    return (
        <div className="text-center py-12">
            <InlineWidget styles={{ minWidth: '100%' }} url="https://calendly.com/deepesh-thesoftcoders" />
        </div>
    )
}
export default Appointment;