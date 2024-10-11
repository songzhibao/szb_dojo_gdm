package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PoliceTypeEntity {

    @ApiModelProperty("类型编号")
    private String typeCode;

    @ApiModelProperty("类型名称")
    private String typeName;

    @ApiModelProperty("排序编号")
    private Integer orderNumber;
}
