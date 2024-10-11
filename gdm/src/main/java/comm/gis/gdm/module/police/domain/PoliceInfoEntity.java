package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PoliceInfoEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("itemid")
    private String itemId;

    @ApiModelProperty("警力编码")
    private String itemCode;

    @ApiModelProperty("警力名称")
    private String deviceName;

    @ApiModelProperty("定位编码")
    private String mainDeviceCode;

    @ApiModelProperty("分组编号")
    private String groupId;

    @ApiModelProperty("警号")
    private String policeNumber;

    @ApiModelProperty("类型ID")
    private String typeId;

    @ApiModelProperty("类型编码")
    private String typeCode;

    @ApiModelProperty("类型名称")
    private String typeName;

    @ApiModelProperty("状态ID")
    private String statusId;

    @ApiModelProperty("状态编码")
    private String statusCode;

    @ApiModelProperty("状态名称")
    private String statusName;

    @ApiModelProperty("机构ID")
    private String orgId;

    @ApiModelProperty("机构Code")
    private String orgCode;

    @ApiModelProperty("机构名称")
    private String orgName;

    @ApiModelProperty("父级机构code")
    private String orgCode2;

    @ApiModelProperty("父级机构名称")
    private String orgName2;

    @ApiModelProperty("民警2 和 车1 分类 ")
    private String carrierType;

    @ApiModelProperty("民警和车对应类型")
    private String vehicleType;

    @ApiModelProperty("手机号")
    private String phone;

    @ApiModelProperty("gps時間")
    private String gpsTime;

    @ApiModelProperty("经度")
    private Double lon;

    @ApiModelProperty("纬度")
    private Double lat;

    @ApiModelProperty("在线状态")
    private String onlineStatus;

    @ApiModelProperty("职务")
    private String jobname;

    private String orgCodeSpatial;

    private String ruleStatus;

    private String dutyStatusLabel;

    private String deviceType;

    private String deviceTypeName;

}
