package comm.gis.gdm.module.layer.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_gis_layer_biz")
public class LayerBizEntity {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("排序序号")
    @TableField(value = "order_number")
    private Integer orderNumber;

}
