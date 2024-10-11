package comm.gis.gdm.module.caseinfo.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CaseStatEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("标题数组")
    private String[] legend;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("图表类型")
    private String chartType;

    @ApiModelProperty("统计项列表")
    private List<CaseSumEntity> children;

}
