package comm.gis.gdm.module.layer.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_gis_layers")
public class LayerInfoEntity {

    @ApiModelProperty("图层id")
    private String id;

    @ApiModelProperty("图层名称")
    private String layerName;

    @ApiModelProperty("图层源类型")
    private String layerType;

    @ApiModelProperty("图层显示名称")
    @TableField(value = "layer_title")
    private String layerTitle;

    @ApiModelProperty("图层图标文件路径")
    private String iconPath;

    @ApiModelProperty("图层连接URL")
    private String showUrl;

    @ApiModelProperty("图层分组ID")
    private String groupId;

    @ApiModelProperty("最小显示分辨率")
    private Double minResolution;

    @ApiModelProperty("最大显示分辨率")
    private Double maxResolution;

    @ApiModelProperty("名称字段")
    private String displayField;

    @ApiModelProperty("气泡显示内容")
    private String isCheck;

    @ApiModelProperty("气泡显示内容")
    private String popInfo;

    @ApiModelProperty("弹窗按钮")
    private String buttons;

    @ApiModelProperty("排序编号")
    private String orderNumber;

}
