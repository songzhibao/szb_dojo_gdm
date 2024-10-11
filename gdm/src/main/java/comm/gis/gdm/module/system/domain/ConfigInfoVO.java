package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.*;

@Data
public class ConfigInfoVO {

    @ApiModelProperty(value = "模块编码", required = true)
    private String module;

    @ApiModelProperty("分组编码")
    private String group;

    @ApiModelProperty("单位ID")
    private List<String> orgIds;

    @ApiModelProperty(value = "用户ID", required = true)
    private String userId;

    @ApiModelProperty("配置编码")
    private List<String> code;
}
