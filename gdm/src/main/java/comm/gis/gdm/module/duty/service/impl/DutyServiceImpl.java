package comm.gis.gdm.module.duty.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.postgis.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.duty.domain.*;
import comm.gis.gdm.module.duty.service.DutyService;
import comm.gis.gdm.util.TimeUtils;

@Service
public class DutyServiceImpl implements DutyService {

    @Autowired
    private DutyMapper dutyDao;

    @Autowired
    private DutyPersonMapper personDao;

    @Override
    public List<DutyRegionEntity> getDutyRegionList(List<String> orgCodes, List<Integer> typeIds) {
        QueryWrapper<DutyRegionEntity> wrapper = new QueryWrapper<>();
        wrapper.in("org_id", orgCodes);
        if (typeIds != null && typeIds.size() > 0) {
            wrapper.in("type", typeIds);
        }
        List<Long> dutyIds = new ArrayList<>();
        List<DutyRegionEntity> list = this.dutyDao.selectList(wrapper);
        for (DutyRegionEntity dutyRegionEntity : list) {
            dutyRegionEntity.setGeom(null);
            dutyIds.add(dutyRegionEntity.getId());
        }

        if (dutyIds.size() > 0) {
            QueryWrapper<DutyPersonEntity> personWrapper = new QueryWrapper<>();
            personWrapper.in("duty_id", dutyIds);
            List<DutyPersonEntity> personList = this.personDao.selectList(personWrapper);
            if (personList != null && personList.size() > 0) {
                for (DutyRegionEntity duty : list) {
                    List<DutyPersonEntity> filterList = personList.stream()
                            .filter(o -> o.getDutyId() == duty.getId().longValue())
                            .collect(Collectors.toList());
                    if (filterList != null && filterList.size() > 0) {
                        Boolean isFirst = true;
                        StringBuilder builder = new StringBuilder();
                        StringBuilder build = new StringBuilder();
                        for (DutyPersonEntity person : filterList) {
                            if (!isFirst) {
                                builder.append("~");
                                build.append("~");
                            }
                            builder.append("姓名：" + person.getName() + ",职务：" + person.getJob() + ",联系电话："
                                    + person.getPhone() + ",编号：" + person.getCode());
                            build.append(person.getJob() + "：" + person.getName()
                                    + ",电话：<a href=# style=\"color:white;\" onclick=javascript:window.SendCallMsg(\""
                                    + person.getPhone() + "\",\"" + person.getName() + "\")>" + person.getPhone()
                                    + "</a>");
                            isFirst = false;
                        }
                        duty.setXLRY(builder.toString());
                        duty.setShowxlry(build.toString());
                    }
                }
            }
        }
        return list;
    }

    @Override
    public Boolean saveRegionInfo(DutyRegionEntity param) {
        Boolean isOK = false;
        if (param.getId() != null && param.getId() > 0) {
            DutyRegionEntity info = this.dutyDao.selectById(param.getId());
            if (info != null) {
                info.setADDRESS(param.getADDRESS());
                info.setCode(param.getCode());
                info.setDWDH(param.getDWDH());
                info.setFILLCOLOR(param.getFILLCOLOR());
                info.setLXDH(param.getLXDH());
                info.setName(param.getName());
                info.setMemo(param.getMemo());
                this.fillGeom(info, param.getRegionContent());
                isOK = this.dutyDao.updateById(info) > 0;
            } else {
                this.fillGeom(param, param.getRegionContent());
                isOK = this.dutyDao.insert(param) > 0;
            }
        } else {
            param.setId(TimeUtils.getIntegerId());
            this.fillGeom(param, param.getRegionContent());
            isOK = this.dutyDao.insert(param) > 0;
        }
        if (isOK) {
            if (StringUtils.hasText(param.getXLRY())) {
                QueryWrapper<DutyPersonEntity> wrapper = new QueryWrapper<>();
                wrapper.eq("duty_id", param.getId());
                this.personDao.delete(wrapper);

                String[] xlryArray = param.getXLRY().split("~");
                if (xlryArray != null && xlryArray.length > 0) {
                    for (String oneMan : xlryArray) {
                        if (StringUtils.hasText(oneMan)) {
                            String[] infoArray = oneMan.split(",");
                            if (infoArray != null && infoArray.length > 0) {
                                DutyPersonEntity entity = new DutyPersonEntity();
                                String[] nameArr = infoArray[0].split("：");
                                if (nameArr.length == 2) {
                                    entity.setName(nameArr[1]);
                                }
                                String[] jobArr = infoArray[1].split("：");
                                if (jobArr.length == 2) {
                                    entity.setJob(jobArr[1]);
                                }
                                String[] phoneArr = infoArray[2].split("：");
                                if (phoneArr.length == 2) {
                                    entity.setPhone(phoneArr[1]);
                                }
                                String[] codeArr = infoArray[3].split("：");
                                if (codeArr.length == 2) {
                                    entity.setCode(codeArr[1]);
                                }
                                entity.setId(TimeUtils.getIntegerId());
                                entity.setDutyId(param.getId());
                                this.personDao.insert(entity);
                            }
                        }
                    }
                }
            }
        }
        return isOK;
    }

    @Override
    public Boolean saveRegionEdit(Long regionId, String content) {
        DutyRegionEntity info = this.dutyDao.selectById(regionId);
        if (info != null) {
            info.setRegionContent(content);
            this.fillGeom(info, content);
            return this.dutyDao.updateById(info) > 0;
        }
        return false;
    }

    @Override
    public Boolean deleteRegion(Long id) {
        return this.dutyDao.deleteById(id) > 0;
    }

    private void fillGeom(DutyRegionEntity info, String regionContent) {
        if (StringUtils.hasText(regionContent)) {
            Double minX = Double.MAX_VALUE, minY = Double.MAX_VALUE, maxX = Double.MIN_VALUE, maxY = Double.MIN_VALUE;
            String[] arrLONLAT = regionContent.split("\\|");
            if (arrLONLAT.length == 2) {
                PGgeometry pg = new PGgeometry();
                if ("Point".equals(arrLONLAT[0])) {
                    String[] arr = arrLONLAT[1].split("\\,");
                    if (arr.length == 2) {
                        Point point = new Point(Double.parseDouble(arr[0]), Double.parseDouble(arr[1]));
                        pg.setGeometry(point);
                        minX = point.getX();
                        minY = point.getY();
                        maxX = point.getX();
                        maxY = point.getY();
                    }
                } else if ("LineString".equals(arrLONLAT[0])) {
                    String[] arr = arrLONLAT[1].split("\\,");
                    Integer i = 0;
                    Point[] points = new Point[arr.length / 2];
                    for (Integer num = 0; num < arr.length; num++) {
                        Point point = new Point(Double.parseDouble(arr[num]), Double.parseDouble(arr[num + 1]));
                        num++;
                        points[i] = point;
                        i++;
                        if (point.getX() < minX) {
                            minX = point.getX();
                        }
                        if (point.getY() < minY) {
                            minY = point.getY();
                        }
                        if (point.getX() > maxX) {
                            maxX = point.getX();
                        }
                        if (point.getY() > maxY) {
                            maxY = point.getY();
                        }
                    }
                    LineString line = new LineString(points);
                    pg.setGeometry(line);
                } else if ("Polygon".equals(arrLONLAT[0])) {
                    String[] arr = arrLONLAT[1].split("\\,");
                    Integer i = 0;
                    Point[] points = new Point[arr.length / 2];
                    for (Integer num = 0; num < arr.length; num++) {
                        Point point = new Point(Double.parseDouble(arr[num]), Double.parseDouble(arr[num + 1]));
                        num++;
                        points[i] = point;
                        i++;
                        if (point.getX() < minX) {
                            minX = point.getX();
                        }
                        if (point.getY() < minY) {
                            minY = point.getY();
                        }
                        if (point.getX() > maxX) {
                            maxX = point.getX();
                        }
                        if (point.getY() > maxY) {
                            maxY = point.getY();
                        }
                    }
                    LinearRing[] rings = new LinearRing[1];
                    rings[0] = new LinearRing(points);
                    Polygon polygon = new Polygon(rings);
                    pg.setGeometry(polygon);
                } else if ("Circle".equals(arrLONLAT[0])) {

                }
                info.setGeom(pg);
            }
            info.setLon((minX + maxX) / 2);
            info.setLat((minY + maxY) / 2);
        }
    }
}
