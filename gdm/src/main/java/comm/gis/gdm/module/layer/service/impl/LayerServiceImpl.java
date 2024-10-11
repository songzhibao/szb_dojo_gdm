package comm.gis.gdm.module.layer.service.impl;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.layer.domain.*;
import comm.gis.gdm.module.layer.service.LayerService;
import comm.gis.gdm.util.SqlUtils;

@Service
public class LayerServiceImpl implements LayerService {

    @Autowired
    private LayerBizMapper layerBizDao;

    @Autowired
    private LayerGroupMapper layerGroupDao;

    @Autowired
    private LayerInfoMapper layerDao;

    @Override
    public List<LayerBizEntity> getLayerBiz() {

        QueryWrapper<LayerBizEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("valid", 1);
        return this.layerBizDao.selectList(wrapper);

    }

    @Override
    public List<LayerGroupEntity> getLayerGroup() {

        QueryWrapper<LayerGroupEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("valid", 1);
        return this.layerGroupDao.selectList(wrapper);

    }

    @Override
    public List<LayerInfoEntity> getLayerInfos() {

        QueryWrapper<LayerInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("valid", 1);
        return this.layerDao.selectList(wrapper);

    }

    @Override
    public List<LayerShowEntity> getResources(LayerInfoVO param) {

        QueryWrapper<LayerInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("layer_name", param.getLayersName());
        LayerInfoEntity info = this.layerDao.selectOne(wrapper);

        String filterSql = "";
        if (StringUtils.hasText(param.getKeyWord())) {
            filterSql += String.format(" and name like '%%%s%%' ", param.getKeyWord());
        }
        if (param.getOrgCodes() != null && param.getOrgCodes().size() > 0) {
            filterSql += SqlUtils.getOrgFilter("org_code", param.getOrgCodes());
        }
        filterSql += SqlUtils.getGisQueryPartSql("gdm_gis_layershow", param.getGisQueryType(),
                param.getGisQueryValue());

        List<LayerShowEntity> list = this.layerDao.selectLayerInfoBySql(param.getLayersName(), filterSql);
        if (list != null) {
            for (LayerShowEntity bean : list) {
                bean.setCode(param.getLayersName() + "_" + bean.getId());
                bean.setShowText(bean.getDispname());
                bean.setDeviceType(param.getLayersName());
                if (info != null) {
                    bean.setImgUrl(info.getIconPath());
                }
            }
        }
        return list;
    }
}
