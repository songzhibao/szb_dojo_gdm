package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PoliceStatusEntity {

    @ApiModelProperty("排序编号")
    private Integer orderNumber;

    @ApiModelProperty("状态ID")
    private String statusId;

    @ApiModelProperty("状态编号")
    private String statusCode;

    @ApiModelProperty("状态名称")
    private String statusName;
}
