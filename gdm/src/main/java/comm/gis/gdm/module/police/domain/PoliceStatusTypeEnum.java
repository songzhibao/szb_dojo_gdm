package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;

public enum PoliceStatusTypeEnum {

    OnDuty("上岗", "1", "0"), OffDuty("下岗", "3", "0"), OnBack("撤离", "18", "0"),

    OnPatrol("路段巡逻", "2", "2"), OnEating("分批就餐", "5", "2"), OnCheck("集中盘查", "10", "2"),

    OnChange("交接班", "13", "2"), OnPower("加油加气", "16", "2"), OnStop("集中停靠", "17", "2"),

    OnToilet("上厕所", "4", "1"), OnTempPower("加油加气（临）", "6", "1"), OnTempDuty("临时勤务", "7", "1"),

    OnSign("签收", "8", "1"), OnArrive("到场", "9", "1"), OnVehicleRepair("车辆维修", "14", "1"),

    OnDispatch("派警", "15", "1");

    @ApiModelProperty("类型名称")
    private String statusName;

    @ApiModelProperty("类型编号")
    private String statusCode;

    @ApiModelProperty("勤务类型  1 为 特殊勤务  2 为 排班勤务")
    private String dutyType;

    private PoliceStatusTypeEnum(String typeName, String statusCode, String dutyType) {
        this.statusName = typeName;
        this.statusCode = statusCode;
        this.dutyType = dutyType;
    }

    public String getDutyType() {
        return dutyType;
    }

    public void setDutyType(String dutyType) {
        this.dutyType = dutyType;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String typeName) {
        this.statusName = typeName;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String typeCode) {
        this.statusCode = typeCode;
    }
}
