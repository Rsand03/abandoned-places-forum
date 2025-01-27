package ee.taltech.iti0302project.app.repository.shopping;

import ee.taltech.iti0302project.app.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

}
