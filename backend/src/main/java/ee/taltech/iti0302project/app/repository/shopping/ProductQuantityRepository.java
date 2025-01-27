package ee.taltech.iti0302project.app.repository.shopping;

import ee.taltech.iti0302project.app.entity.ProductQuantityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductQuantityRepository extends JpaRepository<ProductQuantityEntity, Long> {

}
