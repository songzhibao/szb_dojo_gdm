package comm.gis.gdm.common.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class StatInfoEntity {

    @ApiModelProperty("ID")
    private String id;
    @ApiModelProperty("名称")
    private String name;
    @ApiModelProperty("数量")
    private Integer count = 0;

}
