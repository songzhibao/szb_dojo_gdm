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
public class CaseStatVO extends BaseQueryVO {

    @ApiModelProperty("案由数组")
    private List<Integer> caseTypes;

    @ApiModelProperty("是否参与同比")
    private Boolean isCheckTB;

    @ApiModelProperty("是否参与环比")
    private Boolean isCheckHB;
}
