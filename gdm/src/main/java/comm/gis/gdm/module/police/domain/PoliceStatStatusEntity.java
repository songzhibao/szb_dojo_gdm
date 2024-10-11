package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PoliceStatStatusEntity {

    @ApiModelProperty("排序编号")
    private Integer orderNumber;

    @ApiModelProperty("状态ID")
    private String statusId;

    @ApiModelProperty("状态编号")
    private String statusCode;

    @ApiModelProperty("状态名称")
    private String statusName;

    @ApiModelProperty("在线数量")
    private Integer onlineCount = 0;

    @ApiModelProperty("警力总数")
    private Integer totalCount = 0;
}
