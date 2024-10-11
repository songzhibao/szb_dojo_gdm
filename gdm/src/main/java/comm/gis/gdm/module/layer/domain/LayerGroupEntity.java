package comm.gis.gdm.module.layer.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_gis_layer_group")
public class LayerGroupEntity {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("父级编号")
    @TableField(value = "biz_id")
    private String bizId;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("排序序号")
    @TableField(value = "order_number")
    private Integer orderNumber;

}
