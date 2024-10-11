package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PoliceStatTypeEntity {

    @ApiModelProperty("类型编号")
    private String typeCode;

    @ApiModelProperty("类型名称")
    private String typeName;

    @ApiModelProperty("在线数量")
    private Integer onlineCount = 0;

    @ApiModelProperty("警力总数")
    private Integer totalCount = 0;

    @ApiModelProperty("排序编号")
    private Integer orderNumber;
}
