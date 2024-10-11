package comm.gis.gdm.module.file.service.impl;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.file.domain.*;
import comm.gis.gdm.module.file.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileInfoMapper fileDao;

    @Override
    public List<FileInfoEntity> getAttachmentListByIds(List<String> ids) {

        QueryWrapper<FileInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.in("id", ids);
        return this.fileDao.selectList(wrapper);

    }

    @Override
    public List<FileInfoEntity> getAttachmentListByRelationId(String relationId) {

        QueryWrapper<FileInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("relation_id", relationId);
        return this.fileDao.selectList(wrapper);

    }

    @Override
    public Boolean deleteFileById(String fileId) {
        return this.fileDao.deleteById(fileId) > 0;
    }

    @Override
    public Boolean saveAttachmentInfo(FileInfoEntity param) {
        return this.fileDao.insert(param) > 0;
    }
}
