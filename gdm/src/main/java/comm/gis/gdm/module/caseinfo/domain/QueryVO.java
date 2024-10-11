package comm.gis.gdm.module.caseinfo.domain;

import java.util.List;

import comm.gis.gdm.common.domain.BaseQueryVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 查询参数
 *
 */
@Data
public class QueryVO extends BaseQueryVO {

    @ApiModelProperty("案由数组")
    private List<Integer> caseTypes;

    @ApiModelProperty("查询方式")
    private String gisQueryType;

    @ApiModelProperty("查询值")
    private String gisQueryValue;

    @ApiModelProperty("警情编号")
    private String caseCode;

    @ApiModelProperty("限制量")
    private Integer limit;
}
