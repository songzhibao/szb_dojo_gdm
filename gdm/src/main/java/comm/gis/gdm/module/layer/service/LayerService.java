package comm.gis.gdm.module.layer.service;

import java.util.*;

import comm.gis.gdm.module.layer.domain.*;

public interface LayerService {
    /*
     * 获取图层标签分类信息
     */
    List<LayerBizEntity> getLayerBiz();

    /*
     * 获取图层分组信息
     */
    List<LayerGroupEntity> getLayerGroup();

    /*
     * 获取图层配置信息
     */
    List<LayerInfoEntity> getLayerInfos();

    /*
     * 查询周边图层资源列表
     */
    List<LayerShowEntity> getResources(LayerInfoVO param);
}
