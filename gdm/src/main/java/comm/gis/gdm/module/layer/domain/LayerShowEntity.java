package comm.gis.gdm.module.layer.domain;

import comm.gis.gdm.common.domain.MarkInfoEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LayerShowEntity extends MarkInfoEntity {

    @ApiModelProperty("图层id")
    private String id;

    @ApiModelProperty("图层名称")
    private String layerName;

    @ApiModelProperty("图层源类型")
    private String layerType;

    @ApiModelProperty("显示名称")
    private String dispname;

    @ApiModelProperty("经度")
    private Double lon;

    @ApiModelProperty("维度")
    private Double lat;

    @ApiModelProperty("图形字段")
    private String linestr;

    @ApiModelProperty("属性字段")
    private String lineattr;

}
