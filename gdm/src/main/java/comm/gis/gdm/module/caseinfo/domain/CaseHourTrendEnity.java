package comm.gis.gdm.module.caseinfo.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CaseHourTrendEnity {

    @ApiModelProperty("小时指数")
    private String hourIndex;

    @ApiModelProperty("小时数")
    private String hour;

    @ApiModelProperty("数量")
    private Integer count;

    @ApiModelProperty("上期数量")
    private Integer compareCount;
}
