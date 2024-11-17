export interface RideData {
    rideid: number,
    date: string
    distance: number,
    speedavg: number,
    speedmax: number,
    cadence: number,
    hravg: number,
    hrmax: number,
    title: string,
    poweravg: number,
    powermax: number,
    bikeid: number,
    bikename: string,
    stravaname: string,
    stravaid: number,
    comment: string,
    elevationgain: number,
    elapsedtime: number,
    powernormalized: number,
    intensityfactor: number,
    tss: number,
    matches: number | null,
    trainer: number,
    elevationloss: number,
    datenotime: string | null,
    device_name: string | null,
    fracdim: number,
    calculated_weight_kg: number | null | undefined;
}

export interface RideDataStrava{
    start_date_local: string,
    distance: number,
    average_speed: number,
    max_speed: number,
    average_cadence: number,
    average_heartrate: number,
    max_heartrate: number,
    name: string,
    average_watts: number,
    max_watts: number,
    gear_id: number,
    id: number,
    total_elevation_gain: number,
    moving_time: number,
    weighted_average_watts: number,
    type: string
}

export interface YearAndMonthData {
    rideyear: number;
    total_distance_miles: number;
    jan_distance: number;
    feb_distance: number;
    mar_distance: number;
    apr_distance: number;
    may_distance: number;
    jun_distance: number;
    jul_distance: number;
    aug_distance: number;
    sep_distance: number;
    oct_distance: number;
    nov_distance: number;
    dec_distance: number;
    total_elevationgain: number;
    jan_elevationgain: number;
    feb_elevationgain: number;
    mar_elevationgain: number;
    apr_elevationgain: number;
    may_elevationgain: number;
    jun_elevationgain: number;
    jul_elevationgain: number;
    aug_elevationgain: number;
    sep_elevationgain: number;
    oct_elevationgain: number;
    nov_elevationgain: number;
    dec_elevationgain: number;
    elapsedtime_hours: number;
    jan_elapsedtime_hours: number;
    feb_elapsedtime_hours: number;
    mar_elapsedtime_hours: number;
    apr_elapsedtime_hours: number;
    may_elapsedtime_hours: number;
    jun_elapsedtime_hours: number;
    jul_elapsedtime_hours: number;
    aug_elapsedtime_hours: number;
    sep_elapsedtime_hours: number;
    oct_elapsedtime_hours: number;
    nov_elapsedtime_hours: number;
    dec_elapsedtime_hours: number;
    avg_speed: number;
    jan_avg_speed: number;
    feb_avg_speed: number;
    mar_avg_speed: number;
    apr_avg_speed: number;
    may_avg_speed: number;
    jun_avg_speed: number;
    jul_avg_speed: number;
    aug_avg_speed: number;
    sep_avg_speed: number;
    oct_avg_speed: number;
    nov_avg_speed: number;
    dec_avg_speed: number;
    avg_cadence: number;
    jan_avg_cadence: number;
    feb_avg_cadence: number;
    mar_avg_cadence: number;
    apr_avg_cadence: number;
    may_avg_cadence: number;
    jun_avg_cadence: number;
    jul_avg_cadence: number;
    aug_avg_cadence: number;
    sep_avg_cadence: number;
    oct_avg_cadence: number;
    nov_avg_cadence: number;
    dec_avg_cadence: number;
    avg_hr: number;
    jan_avg_hr: number;
    feb_avg_hr: number;
    mar_avg_hr: number;
    apr_avg_hr: number;
    may_avg_hr: number;
    jun_avg_hr: number;
    jul_avg_hr: number;
    aug_avg_hr: number;
    sep_avg_hr: number;
    oct_avg_hr: number;
    nov_avg_hr: number;
    dec_avg_hr: number;
    max_hr: number;
    jan_max_hr: number;
    feb_max_hr: number;
    mar_max_hr: number;
    apr_max_hr: number;
    may_max_hr: number;
    jun_max_hr: number;
    jul_max_hr: number;
    aug_max_hr: number;
    sep_max_hr: number;
    oct_max_hr: number;
    nov_max_hr: number;
    dec_max_hr: number;
    avg_power: number;
    jan_avg_power: number;
    feb_avg_power: number;
    mar_avg_power: number;
    apr_avg_power: number;
    may_avg_power: number;
    jun_avg_power: number;
    jul_avg_power: number;
    aug_avg_power: number;
    sep_avg_power: number;
    oct_avg_power: number;
    nov_avg_power: number;
    dec_avg_power: number;
    max_power: number;
    jan_max_power: number;
    feb_max_power: number;
    mar_max_power: number;
    apr_max_power: number;
    may_max_power: number;
    jun_max_power: number;
    jul_max_power: number;
    aug_max_power: number;
    sep_max_power: number;
    oct_max_power: number;
    nov_max_power: number;
    dec_max_power: number;
  }

  export interface YearAndDOWData {
    year:  number,
    distancemonday:  number,
    distancetuesday: number,
    distancewednesday: number,
    distancethursday: number,
    distancefriday: number,
    distancesaturday: number,
    distancesunday: number,
    distance: number,
    elevationgainmonday: number,
    elevationgaintuesday: number,
    elevationgainwednesday: number,
    elevationgainthursday: number,
    elevationgainfriday: number,
    elevationgainsaturday: number,
    elevationgainsunday: number,
    elevationgain: number,
    elapsedtimemonday: number,
    elapsedtimetuesday: number,
    elapsedtimewednesday: number,
    elapsedtimethursday: number,
    elapsedtimefriday: number,
    elapsedtimesaturday: number,
    elapsedtimesunday: number,
    elapsedtime: number,
    hraveragemonday: number,
    hraveragetuesday: number,
    hraveragewednesday: number,
    hraveragethursday: number,
    hraveragefriday: number,
    hraveragesaturday: number,
    hraveragesunday: number,
    hraverage: number,
    poweraveragemonday: number,
    poweraveragetuesday: number,
    poweraveragewednesday: number,
    poweraveragethursday: number,
    poweraveragefriday: number,
    poweraveragesaturday: number,
    poweraveragesunday: number,
    poweraverage:number
}

export interface MonthAndDOMData {
    riderid: number,
    dom: number,
    distancejan: number,
    distancefeb: number,
    distancemar: number,
    distanceapr: number,
    distancemay: number,
    distancejun: number,
    distancejul: number,
    distanceaug: number,
    distancesep: number,
    distanceoct: number,
    distancenov: number,
    distancedec: number,
    distance: number,
    elevationgainjan: number,
    elevationgainfeb: number,
    elevationgainmar: number,
    elevationgainapr: number,
    elevationgainmay: number,
    elevationgainjun: number,
    elevationgainjul: number,
    elevationgainaug: number,
    elevationgainsep: number,
    elevationgainoct: number,
    elevationgainnov: number,
    elevationgaindec: number,
    elevationgain: number,
    elapsedtimejan: number,
    elapsedtimefeb: number,
    elapsedtimemar: number,
    elapsedtimeapr: number,
    elapsedtimemay: number,
    elapsedtimejun: number,
    elapsedtimejul: number,
    elapsedtimeaug: number,
    elapsedtimesep: number,
    elapsedtimeoct: number,
    elapsedtimenov: number,
    elapsedtimedec: number,
    elapsedtime: number,
    hraveragejan: number,
    hraveragefeb: number,
    hraveragemar: number,
    hraverageapr: number,
    hraveragemay: number,
    hraveragejun: number,
    hraveragejul: number,
    hraverageaug: number,
    hraveragesep: number,
    hraverageoct: number,
    hraveragenov: number,
    hraveragedec: number,
    hraverage: number,
    poweraveragejan: number,
    poweraveragefeb: number,
    poweraveragemar: number,
    poweraverageapr: number,
    poweraveragemay: number,
    poweraveragejun: number,
    poweraveragejul: number,
    poweraverageaug: number,
    poweraveragesep: number,
    poweraverageoct: number,
    poweraveragenov: number,
    poweraveragedec: number,
    poweraverage: number
}

// Bike Interface
export interface Bike {
    bikeid: number;
    bikename: string;
    stravaname: string;
    isdefault: number;
}

export interface YearAndMonthData {
    rideyear: number;
    total_distance_miles: number;
    jan_distance: number;
    feb_distance: number;
    mar_distance: number;
    apr_distance: number;
    may_distance: number;
    jun_distance: number;
    jul_distance: number;
    aug_distance: number;
    sep_distance: number;
    oct_distance: number;
    nov_distance: number;
    dec_distance: number;
    total_elevationgain: number;
    jan_elevationgain: number;
    feb_elevationgain: number;
    mar_elevationgain: number;
    apr_elevationgain: number;
    may_elevationgain: number;
    jun_elevationgain: number;
    jul_elevationgain: number;
    aug_elevationgain: number;
    sep_elevationgain: number;
    oct_elevationgain: number;
    nov_elevationgain: number;
    dec_elevationgain: number;
    elapsedtime_hours: number;
    jan_elapsedtime_hours: number;
    feb_elapsedtime_hours: number;
    mar_elapsedtime_hours: number;
    apr_elapsedtime_hours: number;
    may_elapsedtime_hours: number;
    jun_elapsedtime_hours: number;
    jul_elapsedtime_hours: number;
    aug_elapsedtime_hours: number;
    sep_elapsedtime_hours: number;
    oct_elapsedtime_hours: number;
    nov_elapsedtime_hours: number;
    dec_elapsedtime_hours: number;
    avg_speed: number;
    jan_avg_speed: number;
    feb_avg_speed: number;
    mar_avg_speed: number;
    apr_avg_speed: number;
    may_avg_speed: number;
    jun_avg_speed: number;
    jul_avg_speed: number;
    aug_avg_speed: number;
    sep_avg_speed: number;
    oct_avg_speed: number;
    nov_avg_speed: number;
    dec_avg_speed: number;
    avg_cadence: number;
    jan_avg_cadence: number;
    feb_avg_cadence: number;
    mar_avg_cadence: number;
    apr_avg_cadence: number;
    may_avg_cadence: number;
    jun_avg_cadence: number;
    jul_avg_cadence: number;
    aug_avg_cadence: number;
    sep_avg_cadence: number;
    oct_avg_cadence: number;
    nov_avg_cadence: number;
    dec_avg_cadence: number;
    avg_hr: number;
    jan_avg_hr: number;
    feb_avg_hr: number;
    mar_avg_hr: number;
    apr_avg_hr: number;
    may_avg_hr: number;
    jun_avg_hr: number;
    jul_avg_hr: number;
    aug_avg_hr: number;
    sep_avg_hr: number;
    oct_avg_hr: number;
    nov_avg_hr: number;
    dec_avg_hr: number;
    max_hr: number;
    jan_max_hr: number;
    feb_max_hr: number;
    mar_max_hr: number;
    apr_max_hr: number;
    may_max_hr: number;
    jun_max_hr: number;
    jul_max_hr: number;
    aug_max_hr: number;
    sep_max_hr: number;
    oct_max_hr: number;
    nov_max_hr: number;
    dec_max_hr: number;
    avg_power: number;
    jan_avg_power: number;
    feb_avg_power: number;
    mar_avg_power: number;
    apr_avg_power: number;
    may_avg_power: number;
    jun_avg_power: number;
    jul_avg_power: number;
    aug_avg_power: number;
    sep_avg_power: number;
    oct_avg_power: number;
    nov_avg_power: number;
    dec_avg_power: number;
    max_power: number;
    jan_max_power: number;
    feb_max_power: number;
    mar_max_power: number;
    apr_max_power: number;
    may_max_power: number;
    jun_max_power: number;
    jul_max_power: number;
    aug_max_power: number;
    sep_max_power: number;
    oct_max_power: number;
    nov_max_power: number;
    dec_max_power: number;
}

export interface SegmentData {
    id: number,
    name: string
    distance: number,
    average_grade: number,
    maximum_grade: number,
    elevation_high: number,
    elevation_low: number,
    total_elevation_gain: number,
    total_elevation_loss: number,
    climb_category: number,
    effort_count: number,
    total_effort_count: number,
    athlete_count: number,
    starred_date: string,
    pr_time: number,
    pr_date: string,
}

export interface SegmentEffort {
    rank: number,
    id: number,
    segment_name: string
    distance: number,
    total_elevation_gain: number,
    start_date: string,
    elapsed_time: number,
    moving_time: number,
    average_cadence: number,
    average_watts: number,
    average_heartrate: number,
    max_heartrate: number,
    start_index: number,
    end_index: number,
}

export interface TagResult{
    name: string;
}

export interface Tagable{
    tags?: string,
}

export interface FetchTagsResult {
    tags: TagResult[];
    error: string | null;
}

export enum LocationId {
    Segments = 1,
    Rides = 2,
    SegmentEfforts = 3,
}

export type RideDataWithTags = RideData & Tagable;
export type SegmentDataWithTags = SegmentData & Tagable;
export type SegmentEffortWithTags = SegmentEffort & Tagable;