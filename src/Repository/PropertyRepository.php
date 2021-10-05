<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class PropertyRepository
{
    /**
     * @var Connection The database connection
     */
    private $connection;

    /**
     * The constructor.
     *
     * @param Connection $connection The database connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     */
    public function findAll(): array
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from('properties')
            ->execute()
            ->fetchAllAssociative()
        ;
    }
}