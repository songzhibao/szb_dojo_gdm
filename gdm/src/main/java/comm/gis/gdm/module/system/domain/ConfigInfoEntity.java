package comm.gis.gdm.module.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_config")
public class ConfigInfoEntity {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("模块编码")
    private String module;

    @ApiModelProperty("分组编码")
    @TableField(value = "groupname")
    private String group;

    @ApiModelProperty("用户ID")
    @TableField(value = "userid")
    private String userId;

    @ApiModelProperty("配置编号")
    private String code;

    @ApiModelProperty("配置信息")
    @TableField(value = "val")
    private String configjson;

    @ApiModelProperty("是否有效")
    @TableField(value = "valid")
    private Integer valid = 1;
}
