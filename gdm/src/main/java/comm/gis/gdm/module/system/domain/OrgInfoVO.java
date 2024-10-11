package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class OrgInfoVO {

    @ApiModelProperty("单位编码")
    private String code;

    @ApiModelProperty("单位类型")
    private Integer orgType;

    @ApiModelProperty("单位级别")
    private String orgLevel;

    @ApiModelProperty("单位名称")
    private String name;

    @ApiModelProperty("是否有效")
    private Integer valid;
}
