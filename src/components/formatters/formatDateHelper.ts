import { FormatDateParams } from "../../types/types";
import { formatDate } from "../../utilities/formatUtilities";

export function formatDateHelper({ date, year, month, dow, dom, cluster, years, start_date, end_date, trainer }: FormatDateParams = {}): string {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Helper to get full date details if `date` is provided
    if (date) {
        const parsedDate = new Date(date);
        year = parsedDate.getFullYear();
        month = parsedDate.getMonth() + 1;
        dow = parsedDate.getDay();
        dom = parsedDate.getDate();
    }

    if (year !== undefined && month !== undefined) {
        if (month === 0) {
            return `All ${year}`;
        } else {
            return `${monthNames[month - 1]} ${year}`;
        }
    }

    if (year !== undefined && dow !== undefined) {
        if (dow === 7) {
            return `All ${year}`;
        } else {
            return `${dayNames[dow]} ${year}`;
        }
    }

    if (dom !== undefined && month !== undefined) {
        if (month === 0) {
            return `All Day ${dom}`;
        } else {
            return `All ${monthNames[month - 1]} ${dom}`;
        }
    }

    if( cluster !== undefined){
        return `Rides for Cluster ${cluster?.cluster} ${cluster?.name}`;
    }

    if( trainer !== undefined){
        return trainer === true ? `Indoor in ${year}` : `Outdoor in ${year}`;
    }

    if (Array.isArray(years)) {
        if (years.length === 0) {
            return `Select one or more years`;
        } else {
            return `${years.join(", ")}`;
        }
    }

    if(start_date !== undefined && end_date !== undefined){
        return `Rides between ${formatDate(start_date)} ${formatDate(end_date)}`;
    }

    return ""; // Fallback for invalid combinations
}