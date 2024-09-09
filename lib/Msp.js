"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc8_dvb_s2 = exports.MspDirection = exports.mspMessageType = exports.MspCmd = void 0;
exports.MspCmd = {
    MSP_API_VERSION: 1,
    MSP_FC_VARIANT: 2,
    MSP_FC_VERSION: 3,
    MSP_BOARD_INFO: 4,
    MSP_BUILD_INFO: 5,
    MSP_NAME: 10,
    MSP_SET_NAME: 11,
    //
    // MSP commands for Cleanflight original features
    //
    MSP_BATTERY_CONFIG: 32,
    MSP_SET_BATTERY_CONFIG: 33,
    MSP_MODE_RANGES: 34,
    MSP_SET_MODE_RANGE: 35,
    MSP_FEATURE_CONFIG: 36,
    MSP_SET_FEATURE_CONFIG: 37,
    MSP_BOARD_ALIGNMENT_CONFIG: 38,
    MSP_SET_BOARD_ALIGNMENT_CONFIG: 39,
    MSP_CURRENT_METER_CONFIG: 40,
    MSP_SET_CURRENT_METER_CONFIG: 41,
    MSP_MIXER_CONFIG: 42,
    MSP_SET_MIXER_CONFIG: 43,
    MSP_RX_CONFIG: 44,
    MSP_SET_RX_CONFIG: 45,
    MSP_LED_COLORS: 46,
    MSP_SET_LED_COLORS: 47,
    MSP_LED_STRIP_CONFIG: 48,
    MSP_SET_LED_STRIP_CONFIG: 49,
    MSP_RSSI_CONFIG: 50,
    MSP_SET_RSSI_CONFIG: 51,
    MSP_ADJUSTMENT_RANGES: 52,
    MSP_SET_ADJUSTMENT_RANGE: 53,
    // private - only to be used by the configurator, the commands are likely to change
    MSP_CF_SERIAL_CONFIG: 54,
    MSP_SET_CF_SERIAL_CONFIG: 55,
    MSP_VOLTAGE_METER_CONFIG: 56,
    MSP_SET_VOLTAGE_METER_CONFIG: 57,
    MSP_SONAR_ALTITUDE: 58,
    MSP_PID_CONTROLLER: 59,
    MSP_SET_PID_CONTROLLER: 60,
    MSP_ARMING_CONFIG: 61,
    MSP_SET_ARMING_CONFIG: 62,
    //
    // Baseflight MSP commands (if enabled they exist in Cleanflight)
    //
    MSP_RX_MAP: 64,
    MSP_SET_RX_MAP: 65,
    // DEPRECATED - DO NOT USE "MSP_BF_CONFIG" and MSP_SET_BF_CONFIG.  In Cleanflight, isolated commands already exist and should be used instead.
    // DEPRECATED - MSP_BF_CONFIG:                   66 //out message baseflight-specific settings that aren't covered elsewhere
    // DEPRECATED - MSP_SET_BF_CONFIG:               67 //in message baseflight-specific settings save
    MSP_REBOOT: 68,
    // Use MSP_BUILD_INFO instead
    // DEPRECATED - MSP_BF_BUILD_INFO               69 //out message build date as well as some space for future expansion
    MSP_DATAFLASH_SUMMARY: 70,
    MSP_DATAFLASH_READ: 71,
    MSP_DATAFLASH_ERASE: 72,
    // No-longer needed
    // DEPRECATED - MSP_LOOP_TIME:                   73, //out message         Returns FC cycle time i.e looptime parameter // DEPRECATED
    // DEPRECATED - MSP_SET_LOOP_TIME:               74, //in message          Sets FC cycle time i.e looptime parameter    // DEPRECATED
    MSP_FAILSAFE_CONFIG: 75,
    MSP_SET_FAILSAFE_CONFIG: 76,
    MSP_RXFAIL_CONFIG: 77,
    MSP_SET_RXFAIL_CONFIG: 78,
    MSP_SDCARD_SUMMARY: 79,
    MSP_BLACKBOX_CONFIG: 80,
    MSP_SET_BLACKBOX_CONFIG: 81,
    MSP_TRANSPONDER_CONFIG: 82,
    MSP_SET_TRANSPONDER_CONFIG: 83,
    MSP_OSD_CONFIG: 84,
    MSP_SET_OSD_CONFIG: 85,
    MSP_OSD_CHAR_READ: 86,
    MSP_OSD_CHAR_WRITE: 87,
    MSP_VTX_CONFIG: 88,
    MSP_SET_VTX_CONFIG: 89,
    // Betaflight Additional Commands
    MSP_ADVANCED_CONFIG: 90,
    MSP_SET_ADVANCED_CONFIG: 91,
    MSP_FILTER_CONFIG: 92,
    MSP_SET_FILTER_CONFIG: 93,
    MSP_PID_ADVANCED: 94,
    MSP_SET_PID_ADVANCED: 95,
    MSP_SENSOR_CONFIG: 96,
    MSP_SET_SENSOR_CONFIG: 97,
    MSP_CAMERA_CONTROL: 98,
    MSP_SET_ARMING_DISABLED: 99,
    //
    // OSD specific
    //
    MSP_OSD_VIDEO_CONFIG: 180,
    MSP_SET_OSD_VIDEO_CONFIG: 181,
    // External OSD displayport mode messages
    MSP_DISPLAYPORT: 182,
    MSP_COPY_PROFILE: 183,
    MSP_BEEPER_CONFIG: 184,
    MSP_SET_BEEPER_CONFIG: 185,
    MSP_SET_TX_INFO: 186,
    MSP_TX_INFO: 187,
    //
    // Multwii original MSP commands
    //
    // See MSP_API_VERSION and MSP_MIXER_CONFIG
    //DEPRECATED -
    MSP_IDENT: 100,
    MSP_STATUS: 101,
    MSP_RAW_IMU: 102,
    MSP_SERVO: 103,
    MSP_MOTOR: 104,
    MSP_RC: 105,
    MSP_RAW_GPS: 106,
    MSP_COMP_GPS: 107,
    MSP_ATTITUDE: 108,
    MSP_ALTITUDE: 109,
    MSP_ANALOG: 110,
    MSP_RC_TUNING: 111,
    MSP_PID: 112,
    // Legacy Multiicommand that was never used.
    //DEPRECATED - MSP_BOX:                  113,    //out message         BOX setup (number is dependant of your setup)
    // Legacy command that was under constant change due to the naming vagueness, avoid at all costs - use more specific commands instead.
    //DEPRECATED - MSP_MISC:                 114,    //out message         powermeter trig
    // Legacy Multiicommand that was never used and always wrong
    //DEPRECATED - MSP_MOTOR_PINS:           115,    //out message         which pins are in use for motors & servos, for GUI
    MSP_BOXNAMES: 116,
    MSP_PIDNAMES: 117,
    MSP_WP: 118,
    MSP_BOXIDS: 119,
    MSP_SERVO_CONFIGURATIONS: 120,
    MSP_NAV_STATUS: 121,
    MSP_NAV_CONFIG: 122,
    MSP_MOTOR_3D_CONFIG: 124,
    MSP_RC_DEADBAND: 125,
    MSP_SENSOR_ALIGNMENT: 126,
    MSP_LED_STRIP_MODECOLOR: 127,
    MSP_VOLTAGE_METERS: 128,
    MSP_CURRENT_METERS: 129,
    MSP_BATTERY_STATE: 130,
    MSP_MOTOR_CONFIG: 131,
    MSP_GPS_CONFIG: 132,
    //DEPRECATED - MSP_COMPASS_CONFIG:       133,    //out message         Compass configuration
    MSP_ESC_SENSOR_DATA: 134,
    MSP_GPS_RESCUE: 135,
    MSP_GPS_RESCUE_PIDS: 136,
    MSP_VTXTABLE_BAND: 137,
    MSP_VTXTABLE_POWERLEVEL: 138,
    MSP_MOTOR_TELEMETRY: 139,
    MSP_SET_RAW_RC: 200,
    MSP_SET_RAW_GPS: 201,
    MSP_SET_PID: 202,
    // Legacy multiiwii command that was never used.
    //DEPRECATED - MSP_SET_BOX:              203,    //in message          BOX setup (number is dependant of your setup)
    MSP_SET_RC_TUNING: 204,
    MSP_ACC_CALIBRATION: 205,
    MSP_MAG_CALIBRATION: 206,
    // Legacy command that was under constant change due to the naming vagueness, avoid at all costs - use more specific commands instead.
    //DEPRECATED - MSP_SET_MISC:             207,    //in message          powermeter trig + 8 free for future use
    MSP_RESET_CONF: 208,
    MSP_SET_WP: 209,
    MSP_SELECT_SETTING: 210,
    MSP_SET_HEADING: 211,
    MSP_SET_SERVO_CONFIGURATION: 212,
    MSP_SET_MOTOR: 214,
    MSP_SET_NAV_CONFIG: 215,
    MSP_SET_MOTOR_3D_CONFIG: 217,
    MSP_SET_RC_DEADBAND: 218,
    MSP_SET_RESET_CURR_PID: 219,
    MSP_SET_SENSOR_ALIGNMENT: 220,
    MSP_SET_LED_STRIP_MODECOLOR: 221,
    MSP_SET_MOTOR_CONFIG: 222,
    MSP_SET_GPS_CONFIG: 223,
    //DEPRECATED - MSP_SET_COMPASS_CONFIG:   224,    //out message         Compass configuration
    MSP_SET_GPS_RESCUE: 225,
    MSP_SET_GPS_RESCUE_PIDS: 226,
    MSP_SET_VTXTABLE_BAND: 227,
    MSP_SET_VTXTABLE_POWERLEVEL: 228,
    // MSP_BIND:                 240,    //in message          no param
    // MSP_ALARMS:               242,
    MSP_EEPROM_WRITE: 250,
    MSP_RESERVE_1: 251,
    MSP_RESERVE_2: 252,
    MSP_DEBUGMSG: 253,
    MSP_DEBUG: 254,
    MSP_V2_FRAME: 255,
    // Additional commands that are not compatible with MultiWii
    MSP_STATUS_EX: 150,
    MSP_UID: 160,
    MSP_GPSSVINFO: 164,
    MSP_GPSSTATISTICS: 166,
    MSP_MULTIPLE_MSP: 230,
    MSP_MODE_RANGES_EXTRA: 238,
    MSP_ACC_TRIM: 240,
    MSP_SET_ACC_TRIM: 239,
    MSP_SERVO_MIX_RULES: 241,
    MSP_SET_SERVO_MIX_RULE: 242,
    MSP_SET_PASSTHROUGH: 245,
    MSP_SET_RTC: 246,
    MSP_RTC: 247,
    MSP_SET_BOARD_INFO: 248,
    MSP_SET_SIGNATURE: 249,
    MSP2_COMMON_SET_RADAR_POS: 0x100b,
    MSP2_COMMON_SET_RADAR_ITD: 0x100c,
};
exports.mspMessageType = {
    OUT: "<",
    IN: ">",
    ERROR: "!",
};
var MspDirection;
(function (MspDirection) {
    MspDirection[MspDirection["TO_FC"] = 60] = "TO_FC";
    MspDirection[MspDirection["FROM_FC"] = 62] = "FROM_FC";
})(MspDirection = exports.MspDirection || (exports.MspDirection = {}));
var crc8_dvb_s2 = function (crc, num) {
    crc = (crc ^ num) & 0xff;
    for (var i = 0; i < 8; i++)
        crc =
            (crc & 0x80 & 0xff) != 0 ? ((crc << 1) ^ 0xd5) & 0xff : (crc << 1) & 0xff;
    return crc;
};
exports.crc8_dvb_s2 = crc8_dvb_s2;
