package ee.taltech.iti0302project.app.dto.mapper.shopping;

import ee.taltech.iti0302project.app.dto.shopping.ProductDto;
import ee.taltech.iti0302project.app.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    List<ProductDto> toDtoList(List<ProductEntity> products);

}
