package comm.gis.gdm.module.police.domain;

import java.util.List;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 查询参数
 *
 */
@Data
public class PoliceQueryVO {

    @ApiModelProperty("单位数组")
    private List<String> orgCodes;

    @ApiModelProperty("警力类型数组")
    private List<String> policeTypes;

    @ApiModelProperty("警力状态数组")
    private List<String> policeStatus;
}
