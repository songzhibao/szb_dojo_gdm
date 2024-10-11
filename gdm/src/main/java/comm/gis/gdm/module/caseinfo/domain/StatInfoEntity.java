package comm.gis.gdm.module.caseinfo.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class StatInfoEntity {

    @ApiModelProperty("ID")
    private String orgId;

    @ApiModelProperty("编号")
    private String orgCode;

    @ApiModelProperty("名称")
    private String orgName;

    @ApiModelProperty("当前数量")
    private Integer count = 0;

    @ApiModelProperty("同比数量")
    private Integer count_tb = 0;

    @ApiModelProperty("环比数量")
    private Integer count_hb = 0;
}
